import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { formatWindowTitle } from "./common";

export const ChooseWindowOnCell = ({ windows, cellIndex, setWindowNumber }) => {
  const { pop } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(windows);

  useEffect(() => {
    const searchString = searchText.toLocaleLowerCase();
    filterList(windows.filter((item) => formatWindowTitle(item).toLocaleLowerCase().includes(searchString)));
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
