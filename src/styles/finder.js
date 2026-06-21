import styled from "styled-components";

export const FinderControls = styled.form`
    width: min(1100px, calc(100% - 30px));
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    background: rgba(0, 0, 0, 0.08);
    border: 2px solid ${({ theme }) => theme.colors.nav};
    border-radius: 12px;
`;

export const FinderLabel = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 15px;
    font-family: "Exo 2";

    input[type="checkbox"] {
        margin-right: 8px;
    }
`;

export const FinderSelect = styled.select`
    padding: 8px;
    border: 1px solid #111;
    border-radius: 6px;
    background: #fff;
`;

export const FinderInput = styled.input`
    padding: 8px;
    border: 1px solid #111;
    border-radius: 6px;
`;

export const FinderResultsNote = styled.p`
    max-width: 1100px;
    margin: 15px auto 0;
    padding: 0 15px;
    text-align: center;
    font-family: "Exo 2";
`;

export const FinderGrid = styled.div`
    width: min(1200px, calc(100% - 20px));
    margin: 25px auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
`;

export const FinderCard = styled.div`
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 14px;
    align-items: center;
    padding: 12px;
    color: inherit;
    text-decoration: none;
    border: 2px solid ${({ theme }) => theme.colors.nav};
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    transition: transform 0.2s, box-shadow 0.2s;

    :hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
    }

    img {
        width: 110px;
        height: 72px;
        object-fit: cover;
        border-radius: 8px;
    }

    h2 {
        margin: 0 0 6px;
        font-size: 20px;
    }

    strong {
        font-size: 18px;
    }
`;

export const FinderMeta = styled.div`
    margin-top: 6px;
    color: #444;
    font-size: 13px;
`;
