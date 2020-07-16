import { Toolbar, Content, Page } from "../components/Toolbar";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import styled from "styled-components";

const NoDecksContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: -100px;
`;

export default function MyDecks() {
  return (
    <Page>
      <Toolbar />
      <Content>
        <NoDecksContainer>
          <div>Build your first deck:&nbsp;</div>
          <Link href="/deck/new">
            <Button variant="contained" color="primary">
              New Deck
            </Button>
          </Link>
        </NoDecksContainer>
      </Content>
    </Page>
  );
}
