import { useState } from "react";
import { Toolbar, Content, Page } from "../../components/Toolbar";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";

export default function NewDeck() {
  const [side, setSide] = useState("dark");
  return (
    <Page>
      <Toolbar />
      <Content>
        <h1>Choose a side</h1>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img src="/images/dark.png"></img>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "center",
              }}
              onClick={() => setSide("dark")}
            >
              <Radio
                checked={side === "dark"}
                onChange={() => setSide("dark")}
                value="a"
                name="radio-button-demo"
              />
              Dark
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img src="/images/light.png"></img>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "center",
              }}
              onClick={() => setSide("light")}
            >
              <Radio
                checked={side === "light"}
                onChange={() => setSide("light")}
                value="a"
                name="radio-button-demo"
              />
              Light
            </div>
          </div>
        </div>
        <Button variant="contained" color="primary">
          Create deck
        </Button>
      </Content>
    </Page>
  );
}
