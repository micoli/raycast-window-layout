import { Action, ActionPanel, Grid, useNavigation } from "@raycast/api";
import { formatWindowTitle, layoutDefinitionsToSVG } from "./common";
import { ChooseLayoutGrid } from "./ChooseLayoutGrid";
import { layouts } from "./layouts";
import { useEffect, useState } from "react";

export default function Command() {
  const { push } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(layouts);

  useEffect(() => {
    const searchString = searchText.toLocaleLowerCase();
    filterList(layouts.filter((item) => formatWindowTitle(item).toLocaleLowerCase().includes(searchString)));
  }, [searchText]);

  return (
    <Grid
      columns={3}
      inset={Grid.Inset.Small}
      onSearchTextChange={setSearchText}
      aspectRatio="16/9"
      filtering={false}
      navigationTitle="Layout"
      searchBarPlaceholder="Choose a layout"
    >
      {filteredList.map((layout) => (
        <Grid.Item
          key={layout.name}
          content={layoutDefinitionsToSVG(layout, "no_selection", {})}
          title={layout.name}
          actions={
            <ActionPanel>
              <Action title="Select a Layout" onAction={() => push(<ChooseLayoutGrid layout={layout} />)} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
