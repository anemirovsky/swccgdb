import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import FlagIcon from "@material-ui/icons/Flag";
import GavelIcon from "@material-ui/icons/Gavel";
import { Card } from "./card.interface";
import { unique, sortAlphabetically } from "../../utils/utils";
import { useState } from "react";
import { Radio } from "@material-ui/core";
import { darkBlue } from "../../utils/colors";

const FilterOptionsContainer = styled.div`
  position: absolute;
  background-color: ${darkBlue};
  color: white;
  max-height: 400px;
  overflow-y: scroll;
  top: 37px;
  left: 0px;
  padding: 10px;
  font-size: 14px;
  width: 200px;
  border: 1px solid black;
`;

const ClickableFilterIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
`;

const FilterIconContainer = styled.div`
  position: relative;
  border-radius: 50px;
  border: 1px solid #6f6f6f;
  display: flex;
  align-items: center;
  padding: 2px 0px;
  padding-right: 10px;
  justify-content: center;
  margin-right: 10px;
`;

const SearchContainer = styled.div`
  border-radius: 50px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  margin-right: 10px;
`;

const CardFilterBarContainer = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: #2d2d2f;
  justify-content: center;
  padding: 10px;
  color: white;
  align-items: center;
`;

const Input = styled.input`
  background-color: transparent;
  border: 0px;
  color: white;
  &:focus {
    outline: none;
  }
`;

export function applyFilters(allCards: Card[], filters: CardFilters) {
  // TODO add side filter
  return allCards.filter((card) => {
    if (!filters || !filters.titleFilter) {
      return true;
    }
    return card.front.title
      .toLowerCase()
      .includes(filters.titleFilter.toLowerCase());
  });
}

const DEFAULT_OPTION = "All";

function FilterIcon({
  Icon,
  text,
  options,
  active,
  onOptionChosen,
}: {
  active?: string;
  Icon: any;
  text: string;
  options?: string[];
  onOptionChosen: (option: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FilterIconContainer>
      <ClickableFilterIcon onClick={() => setOpen(!open)}>
        <Icon
          style={{
            fontSize: "30px",
            marginRight: "5px",
            borderRadius: "100px",
            border: "1px solid white",
            padding: "5px",
          }}
        ></Icon>
        <div style={{ marginLeft: "3px" }}>{text}</div>

        <ExpandMoreIcon
          style={{
            marginLeft: "5px",
            fontSize: "16px",
          }}
        />
      </ClickableFilterIcon>
      {open ? (
        <FilterOptionsContainer>
          {[DEFAULT_OPTION, ...(options || [])].map((option, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => onOptionChosen(option)}
            >
              <Radio style={{ color: "white" }} checked={active === option} />
              <div>{option}</div>
            </div>
          ))}
        </FilterOptionsContainer>
      ) : null}
    </FilterIconContainer>
  );
}
export interface CardFilters {
  titleFilter: string;
  set?: string;
}

export function CardFiltersBar({
  allCards,
  filters,
  onUpdateFilters,
}: {
  allCards: Card[];
  filters?: CardFilters;
  onUpdateFilters: (cardFilters: CardFilters) => void;
}) {
  const sets = sortAlphabetically(unique(allCards.map(({ set }) => set)));
  console.log(sets);
  return (
    <CardFilterBarContainer>
      <SearchContainer>
        <SearchIcon style={{ transform: "rotate(90deg)" }} />
        <Input
          placeholder="Search"
          defaultValue={filters && filters.titleFilter}
          onKeyUp={(e) =>
            onUpdateFilters({ ...filters, titleFilter: e.target.value })
          }
        ></Input>
      </SearchContainer>
      <FilterIcon
        Icon={MenuBookIcon}
        text={"Set: All"}
        options={sets}
        active={(filters && filters.set) || DEFAULT_OPTION}
        onOptionChosen={(option) =>
          onUpdateFilters({ ...filters, set: option })
        }
      />
      <FilterIcon
        Icon={SupervisorAccountIcon}
        text={"Type: All"}
        active={DEFAULT_OPTION}
        onOptionChosen={() => {}}
      />
      <FilterIcon
        Icon={BlurOnIcon}
        text={"Destiny: All"}
        active={DEFAULT_OPTION}
        onOptionChosen={() => {}}
      />
      <FilterIcon
        Icon={GavelIcon}
        text={"Power: All"}
        active={DEFAULT_OPTION}
        onOptionChosen={() => {}}
      />
      <FilterIcon
        Icon={ArrowUpwardIcon}
        text={"Deploy: All"}
        active={DEFAULT_OPTION}
        onOptionChosen={() => {}}
      />
      <FilterIcon
        Icon={FlagIcon}
        text={"Forfeit: All"}
        active={DEFAULT_OPTION}
        onOptionChosen={() => {}}
      />
    </CardFilterBarContainer>
  );
}
