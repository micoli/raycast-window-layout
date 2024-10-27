import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { CellWindowNumberMap, formatWindowTitle } from "./common";
import { Window } from "./WindowManager";

export const ChooseWindowOnCell = ({
  windows,
  cellIndex,
  setWindowNumber,
  cellWindowNumberMap,
}: {
  windows: Window[];
  cellIndex: number;
  setWindowNumber: (cellIndex: number, windowNumber: number) => void;
  cellWindowNumberMap: CellWindowNumberMap;
}) => {
  const { pop } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(windows);
  const otherWindowNumbers = [];
  for (const [index, value] of Object.entries(cellWindowNumberMap)) {
    if (index != cellIndex && value !== null) {
      otherWindowNumbers.push(value);
    }
  }

  useEffect(() => {
    const searchString = searchText.toLocaleLowerCase();

    filterList(
      windows.filter(
        (window) =>
          formatWindowTitle(window).toLocaleLowerCase().includes(searchString) &&
          !otherWindowNumbers.includes(window.number),
      ),
    );
  }, [searchText]);

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search window"
      searchBarPlaceholder="Search a window to resize in layout cell"
    >
      {filteredList.map((window) => (
        <List.Item
          key={`${window.number}`}
          title={formatWindowTitle(window)}
          icon={window.icon}
          actions={
            <ActionPanel>
              <Action
                title="Select"
                onAction={() => {
                  setWindowNumber(cellIndex, window.number);
                  pop();
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};
