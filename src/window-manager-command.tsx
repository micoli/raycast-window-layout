import { Action, ActionPanel, Grid, useNavigation } from "@raycast/api";
import { Layout, layoutDefinitionsToSVG } from "./common";
import { ChooseLayoutGrid } from "./ChooseLayoutGrid";

export default function Command() {
  const { push } = useNavigation();
  const layouts: Layout[] = [
    {
      name: "split",
      rows: [{ height: 1, cells: [{ width: 1 }, { width: 1 }] }],
    },
    {
      name: "split 2+1",
      rows: [{ height: 1, cells: [{ width: 2 }, { width: 1 }] }],
    },
    {
      name: "split 1+1+1",
      rows: [{ height: 1, cells: [{ width: 1 }, { width: 1 }, { width: 1 }] }],
    },
    {
      name: "split 1+2",
      rows: [{ height: 1, cells: [{ width: 1 }, { width: 2 }] }],
    },
    {
      name: "split 2*1+2",
      rows: [
        { height: 1, cells: [{ width: 1 }, { width: 2 }] },
        { height: 1, cells: [{ width: 2 }, { width: 1 }] },
      ],
    },
  ];

  return (
    <Grid
      columns={3}
      inset={Grid.Inset.Small}
      aspectRatio="16/9"
      filtering={false}
      navigationTitle="Layout"
      searchBarPlaceholder="Choose a layout"
    >
      {layouts.map((layout) => (
        <Grid.Item
          key={layout.name}
          content={layoutDefinitionsToSVG(layout, "no_selection", {})}
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
