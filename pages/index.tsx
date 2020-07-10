import { Toolbar, Content, Page } from "../components/Toolbar";
import styled from "styled-components";
import { DeckTile } from "../components/DeckTile";

const HomePageContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const HomePageTitle = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: #333333;
  margin-top: 30px;
  margin-bottom: 15px;
`;

const HomePageH2 = styled.div`
  font-size: 32px;
  margin-bottom: 100px;
`;

export default function Home() {
  return (
    <Page>
      <Toolbar />
      <Content>
        <HomePageContent>
          <HomePageTitle>SW:CCG DB</HomePageTitle>
          <HomePageH2>
            Deckbuilder for the Star Wars Customizable Card Game
          </HomePageH2>
          <DeckTile />
        </HomePageContent>
      </Content>
    </Page>
  );
}
