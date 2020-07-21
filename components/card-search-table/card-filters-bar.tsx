import SearchIcon from "@material-ui/icons/Search";
import ClickAwayListener from "react-click-away-listener";
import styled from "styled-components";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import FlagIcon from "@material-ui/icons/Flag";
import GavelIcon from "@material-ui/icons/Gavel";
import { Card, Side } from "./card.interface";
import { unique, sortAlphabetically } from "../../utils/utils";
import { useState } from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { darkBlue } from "../../utils/colors";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import FilterListIcon from "@material-ui/icons/FilterList";
import { orange } from "@material-ui/core/colors";

const lightOrange = orange[200];

const FilterName = styled.div`
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => (props.isFiltered ? lightOrange : "white")};
`;

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
  z-index: 10;
  position: relative;
  border-radius: 50px;
  border: 1px solid ${(props) => (props.isFiltered ? lightOrange : "#6f6f6f")};
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
  color: white;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 20px;
  @media (min-width: 1000px) {
    padding: 10px 100px;
  }
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
  return allCards
    .filter((card) => {
      if (!filters || !filters.side) {
        return true;
      }

      return filters.side.includes(card.side);
    })
    .filter((card) => {
      if (!filters || !filters.type) {
        return true;
      }

      return filters.type.includes(card.front.type);
    })
    .filter((card) => {
      if (!filters || !filters.sets) {
        return true;
      }

      return filters.sets.includes(card.set);
    })
    .filter((card) => {
      if (!filters || !filters.destiny) {
        return true;
      }

      const destiny = card.front.destiny && card.front.destiny.toString();
      return filters.destiny.includes(destiny);
    })
    .filter((card) => {
      if (!filters || !filters.forfeit) {
        return true;
      }

      const forfeit = card.front.forfeit && card.front.forfeit.toString();
      return filters.forfeit.includes(forfeit);
    })
    .filter((card) => {
      if (!filters || !filters.deploy) {
        return true;
      }

      const deploy = card.front.deploy && card.front.deploy.toString();
      return filters.deploy.includes(deploy);
    })
    .filter((card) => {
      if (!filters || !filters.power) {
        return true;
      }

      const power = card.front.power && card.front.power.toString();
      return filters.power.includes(power);
    })
    .filter((card) => {
      if (!filters || !filters.titleFilter) {
        return true;
      }
      return card.front.title
        .toLowerCase()
        .includes(filters.titleFilter.toLowerCase());
    });
}

enum DropDownFilters {
  side = "side",
  set = "set",
  type = "type",
  destiny = "destiny",
  power = "power",
  deploy = "deploy",
  forfeit = "forfeit",
}

const DEFAULT_OPTION = "All";

function FilterIcon({
  open,
  Icon,
  name,
  options,
  active,
  onOptionChosen,
  onOpen,
  onClose,
}: {
  open: boolean;
  name: string;
  active?: string | string[];
  Icon: any;
  options?: string[];
  onOpen: () => void;
  onClose: () => void;
  onOptionChosen: (option: string) => void;
}) {
  const isChecked = (option) => {
    if (option === DEFAULT_OPTION && active === undefined) {
      return true;
    }
    return Array.isArray(active) ? active.includes(option) : active === option;
  };
  const isFiltered = !Boolean(
    active === DEFAULT_OPTION || active === undefined
  );
  return (
    <FilterIconContainer isFiltered={isFiltered}>
      <ClickableFilterIcon onClick={() => (!open ? onOpen() : onClose())}>
        <Icon
          style={{
            fontSize: "30px",
            marginRight: "5px",
            borderRadius: "100px",
            border: `1px solid ${isFiltered ? lightOrange : "white"}`,
            padding: "5px",
            color: isFiltered ? lightOrange : "white",
          }}
        ></Icon>
        <FilterName isFiltered={isFiltered}>
          {name}&nbsp;
          {isFiltered ? "Filtered" : DEFAULT_OPTION}
        </FilterName>

        <ExpandMoreIcon
          style={{
            color: isFiltered ? lightOrange : "white",
            marginLeft: "5px",
            fontSize: "16px",
          }}
        />
      </ClickableFilterIcon>
      {open ? (
        <ClickAwayListener onClickAway={() => onClose()}>
          <FilterOptionsContainer>
            {[DEFAULT_OPTION, ...(options || [])].map((option, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={() => onOptionChosen(option)}
              >
                <Checkbox
                  style={{ color: "white" }}
                  checked={isChecked(option)}
                />
                <div>{option}</div>
              </div>
            ))}
          </FilterOptionsContainer>
        </ClickAwayListener>
      ) : null}
    </FilterIconContainer>
  );
}
export interface CardFilters {
  titleFilter: string;
  side?: Side | string;
  sets?: string[];
  type?: string;
  destiny?: string;
  power?: string;
  deploy?: string;
  forfeit?: string;
}

export function CardFiltersBar({
  allCards,
  filters,
  showSideFilter = true,
  onUpdateFilters,
}: {
  allCards: Card[];
  showSideFilter?: boolean;
  filters?: CardFilters;
  onUpdateFilters: (cardFilters: CardFilters) => void;
}) {
  const [openDropDown, setOpenDropDown] = useState(undefined);
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const sets = sortAlphabetically(unique(allCards.map(({ set }) => set)));
  const types = sortAlphabetically(
    unique(allCards.map(({ front: { type } }) => type))
  );
  const destiny = sortAlphabetically(
    unique(
      allCards
        .map(({ front: { destiny } }) => destiny)
        .filter(Boolean)
        .map((destiny) => destiny.toString())
    )
  );
  const powerOptions = sortAlphabetically(
    unique(
      allCards
        .map(({ front: { power } }) => power)
        .filter(Boolean)
        .map((power) => power.toString())
    )
  );
  const deployOptions = sortAlphabetically(
    unique(
      allCards
        .map(({ front: { deploy } }) => deploy)
        .filter(Boolean)
        .map((deploy) => deploy.toString())
    )
  );
  const forfeitOptions = sortAlphabetically(
    unique(
      allCards
        .map(({ front: { forfeit } }) => forfeit)
        .filter(Boolean)
        .map((forfeit) => forfeit.toString())
    )
  );
  const optionChosen = (filterKey: string) => (newOption: string) => {
    if (newOption === DEFAULT_OPTION) {
      onUpdateFilters({
        ...filters,
        [filterKey]: undefined,
      });
      return;
    }
    const options = filters[filterKey] || [];
    let newOptions;
    if (options.includes(newOption)) {
      const indexOfOption = options.indexOf(newOption);
      newOptions = [
        ...options.slice(0, indexOfOption),
        undefined,
        ...options.slice(indexOfOption + 1),
      ];
    } else {
      newOptions = [...options, newOption];
    }

    onUpdateFilters({
      ...filters,
      [filterKey]: newOptions.length === 0 ? undefined : newOptions,
    });
  };
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

      <div style={{ display: "flex", flexGrow: 1 }}></div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          cursor: "pointer",
          color: "white",
          width: "50%",
        }}
        onClick={() => setFilterBarOpen(!filterBarOpen)}
      >
        <FilterListIcon></FilterListIcon>
        <div>Filters</div>
      </div>

      {filterBarOpen ? (
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "space-between",
          }}
        >
          {showSideFilter ? (
            <FilterIcon
              Icon={RecentActorsIcon}
              name={"Side:"}
              options={[Side.dark, Side.light]}
              active={(filters && filters.side) || DEFAULT_OPTION}
              open={openDropDown === DropDownFilters.side}
              onOpen={() => setOpenDropDown(DropDownFilters.side)}
              onClose={() => setOpenDropDown(undefined)}
              onOptionChosen={optionChosen("side")}
            />
          ) : null}

          <FilterIcon
            Icon={MenuBookIcon}
            name={"Set:"}
            options={sets}
            active={filters && filters.sets}
            open={openDropDown === DropDownFilters.set}
            onOpen={() => setOpenDropDown(DropDownFilters.set)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("sets")}
          />
          <FilterIcon
            Icon={SupervisorAccountIcon}
            name={"Type:"}
            options={types}
            active={(filters && filters.type) || DEFAULT_OPTION}
            open={openDropDown === DropDownFilters.type}
            onOpen={() => setOpenDropDown(DropDownFilters.type)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("type")}
          />
          <FilterIcon
            Icon={BlurOnIcon}
            name={"Destiny:"}
            active={(filters && filters.destiny) || DEFAULT_OPTION}
            options={destiny}
            open={openDropDown === DropDownFilters.destiny}
            onOpen={() => setOpenDropDown(DropDownFilters.destiny)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("destiny")}
          />
          <FilterIcon
            Icon={GavelIcon}
            name={"Power:"}
            active={(filters && filters.power) || DEFAULT_OPTION}
            options={powerOptions}
            open={openDropDown === DropDownFilters.power}
            onOpen={() => setOpenDropDown(DropDownFilters.power)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("power")}
          />
          <FilterIcon
            Icon={ArrowUpwardIcon}
            name={"Deploy:"}
            active={(filters && filters.deploy) || DEFAULT_OPTION}
            options={deployOptions}
            open={openDropDown === DropDownFilters.deploy}
            onOpen={() => setOpenDropDown(DropDownFilters.deploy)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("deploy")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Forfeit:"}
            active={(filters && filters.forfeit) || DEFAULT_OPTION}
            options={forfeitOptions}
            open={openDropDown === DropDownFilters.forfeit}
            onOpen={() => setOpenDropDown(DropDownFilters.forfeit)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("forfeit")}
          />
        </div>
      ) : null}
    </CardFilterBarContainer>
  );
}
