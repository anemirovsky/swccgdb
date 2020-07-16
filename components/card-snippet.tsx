import { useState, useEffect, useRef } from "react";
import { Card, Side } from "./card-search-table/card.interface";
import styled from "styled-components";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { darkBlue } from "../utils/colors";

const CardControlButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fcd144;
  border-left: 1px solid #2f2f2f;
  height: 100%;
  width: 30px;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export function CardSnippet({
  card,
  style,
  isHovering,
  backgroundColor = darkBlue,
  hoverButtons,
  removeCard,
  addCard,
  onCardInfo,
  onMouseDown,
}: {
  card: Card;
  backgroundColor?: string;
  style?: CSSProperties;
  isHovering?: boolean;
  hoverButtons?: {
    text: string;
    fontSize?: string;
    onClick: () => void;
  }[];
  removeCard?: () => void;
  addCard?: () => void;
  onCardInfo?: () => void;
  onMouseDown?: () => void;
}) {
  const [url, setUrl] = useState(card.front.imageUrl);
  useEffect(() => {
    setUrl(card.front.imageUrl);
  }, [card.front.imageUrl]);
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 1,
      }}
    >
      <div
        style={{
          width: "50%",
          whiteSpace: "nowrap",
          color: "white",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {card.front.title}
      </div>
      <div
        style={{
          backgroundImage: `url(${url})`,
          backgroundPosition: "-24px -130px",
          backgroundSize: "240px",
          width: "50%",
          position: "relative",
        }}
        onLoad={() => console.log("loaded")}
      >
        <img
          src={url}
          style={{ display: "none" }}
          onError={(e) =>
            setUrl(
              card.side === Side.dark ? "/images/dark.png" : "/images/light.png"
            )
          }
        ></img>
        <div
          style={{
            background: `linear-gradient(to left, rgba(255,255,255,0) 0%, ${backgroundColor} 100%)`,
            height: "100%",
          }}
        ></div>
        <div
          style={{
            display: isHovering ? "flex" : "none",
            zIndex: 10,
            position: "absolute",
            top: "0px",
            right: "0px",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            userSelect: "none",
          }}
        >
          {hoverButtons
            ? hoverButtons.map(({ text, fontSize, onClick }) => (
                <CardControlButton
                  onClick={onClick}
                  style={{ fontSize: fontSize || "initial" }}
                >
                  {text}
                </CardControlButton>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
