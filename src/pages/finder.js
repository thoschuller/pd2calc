import { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Main, MainTitle } from "../styles/main";
import { FinderControls, FinderGrid, FinderCard, FinderMeta, FinderSelect, FinderInput, FinderLabel, FinderResultsNote } from "../styles/finder";

const riskByDifficulty = {
    Normal: 0,
    Hard: 0.2,
    "Very Hard": 0.5,
    Overkill: 1,
    Mayhem: 1.25,
    "Death Wish": 1.5,
    "Death Sentence": 14,
};

const gageByDifficulty = {
    Normal: 2,
    Hard: 4,
    "Very Hard": 6,
    Overkill: 8,
    Mayhem: 10,
    "Death Wish": 10,
    "Death Sentence": 10,
};

class Finder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jobs: [],
            approach: "all",
            difficulty: "Death Sentence",
            players: 4,
            jailed: 0,
            level: 100,
            infamy: 205,
            teamboosts: 4,
            perkdeck: true,
            gage: 10,
            stealthBonus: 0,
            heat: 0,
            loot: "max",
        };
    }

    componentDidMount = () => {
        axios
            .get("jobfinder.json")
            .then((res) => this.setState({ jobs: res.data }))
            .catch((err) => console.log(err));
    };

    updateValue = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState({ [name]: type === "checkbox" ? checked : value });
    };

    calculateJob = (job) => {
        const players = Number(this.state.players);
        const jailed = Number(this.state.jailed);
        const crew = Math.max(0, (players - jailed - 1) / 10);
        const custody = jailed > 0 ? 0.3 : 0;
        const risk = riskByDifficulty[this.state.difficulty];
        const gageMax = gageByDifficulty[this.state.difficulty];
        const selectedGage = Math.min(Number(this.state.gage), gageMax);
        const bonus = (this.state.perkdeck ? 45 : 0) + Number(this.state.teamboosts) * 3;
        const levelDifference = job.jc - Number(this.state.level);
        let penalty = 0;

        if (levelDifference > 10 && levelDifference <= 20) penalty = 10;
        if (levelDifference > 20 && levelDifference <= 30) penalty = 20;
        if (levelDifference > 30 && levelDifference <= 40) penalty = 30;
        if (levelDifference > 40 && levelDifference <= 50) penalty = 40;
        if (levelDifference > 50 && levelDifference <= 60) penalty = 50;
        if (levelDifference > 60 && levelDifference <= 70) penalty = 60;

        const classic = this.state.loot === "completion" ? job.requirements[0].xp : job.base;
        const withoutPenalty = classic - (classic * penalty) / 100;
        const basic = withoutPenalty + withoutPenalty * risk;
        const afterCustody = basic - basic * custody;
        const crewExp = Math.round(afterCustody * crew);
        const bonusExp = Math.round(afterCustody * bonus / 100);
        const infamyExp = Math.round(afterCustody * Number(this.state.infamy) / 100);
        const gageExp = Math.round(afterCustody * (5 * selectedGage / gageMax) / 100);
        const stealthExp = Math.round((afterCustody + crewExp + bonusExp + infamyExp + gageExp) * (Number(this.state.stealthBonus) / 100));
        const heatExp = Math.round((afterCustody + crewExp + bonusExp + infamyExp + gageExp + stealthExp) * (Number(this.state.heat) / 100));

        return Math.round(afterCustody + crewExp + bonusExp + infamyExp + gageExp + stealthExp + heatExp);
    };

    filteredJobs = () => this.state.jobs
        .filter((job) => this.state.approach === "all" || job.approach === this.state.approach || (this.state.approach === "stealthable" && job.approach !== "loud"))
        .map((job) => ({ ...job, exp: this.calculateJob(job) }))
        .sort((a, b) => b.exp - a.exp);

    render() {
        const results = this.filteredJobs();

        return (
            <Main>
                <MainTitle>Find the best EXP job</MainTitle>
                <FinderControls>
                    <FinderLabel>Approach<FinderSelect name="approach" value={this.state.approach} onChange={this.updateValue}><option value="all">All jobs</option><option value="stealthable">Stealth-able</option><option value="stealth">Stealth only</option><option value="loud">Loud only</option><option value="both">Loud and stealth-able</option></FinderSelect></FinderLabel>
                    <FinderLabel>Difficulty<FinderSelect name="difficulty" value={this.state.difficulty} onChange={this.updateValue}>{Object.keys(riskByDifficulty).map((difficulty) => <option key={difficulty}>{difficulty}</option>)}</FinderSelect></FinderLabel>
                    <FinderLabel>Players<FinderInput name="players" type="number" min="1" max="4" value={this.state.players} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>In custody<FinderInput name="jailed" type="number" min="0" max="3" value={this.state.jailed} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Player level<FinderInput name="level" type="number" min="0" max="100" value={this.state.level} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Infamy bonus %<FinderInput name="infamy" type="number" min="0" max="205" value={this.state.infamy} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Team boosts<FinderInput name="teamboosts" type="number" min="0" max="4" value={this.state.teamboosts} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Gage packages<FinderInput name="gage" type="number" min="0" max="10" value={this.state.gage} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Stealth bonus %<FinderInput name="stealthBonus" type="number" min="0" max="25" value={this.state.stealthBonus} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Heat bonus %<FinderInput name="heat" type="number" min="-30" max="15" value={this.state.heat} onChange={this.updateValue} /></FinderLabel>
                    <FinderLabel>Loot estimate<FinderSelect name="loot" value={this.state.loot} onChange={this.updateValue}><option value="max">Maximum listed loot/objectives</option><option value="completion">Completion only</option></FinderSelect></FinderLabel>
                    <FinderLabel><input name="perkdeck" type="checkbox" checked={this.state.perkdeck} onChange={this.updateValue} /> Perk deck bonus</FinderLabel>
                </FinderControls>
                <FinderResultsNote>Results use the same major EXP modifiers as the heist calculator and estimate optional loot from each job's listed objectives.</FinderResultsNote>
                <FinderGrid>
                    {results.map((job) => <FinderCard as={Link} to={job.link} key={job.id}>
                        <img src={job.img} alt={job.name} />
                        <div><h2>{job.name}</h2><strong>{job.exp.toLocaleString()} EXP</strong><FinderMeta>JC {job.jc} · {job.approach} · base {job.base.toLocaleString()}</FinderMeta></div>
                    </FinderCard>)}
                </FinderGrid>
            </Main>
        );
    }
}

export default Finder;
