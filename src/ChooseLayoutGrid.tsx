import { CellWindowNumberMap, enumerateCells, formatWindowTitle, Layout, layoutDefinitionsToSVG } from "./common";
import { Action, ActionPanel, Grid, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { Display, listDisplays, listWindows, Window } from "./WindowManager";
import { doLayout } from "./layoutManager";
import { ChooseWindowOnCell } from "./ChooseWindowOnCell";

export const ChooseLayoutGrid = ({ layout }: { layout: Layout }) => {
  const { push } = useNavigation();
  const [windows, setWindows] = useState<Window[]>([]);
  const [displays, setDisplays] = useState<Display[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [cellWindowNumberMap, setCellWindowNumberMap] = useState<CellWindowNumberMap>(
    enumerateCells(layout.rows).reduce((carry, item) => {
      carry[item.index] = null;
      return carry;
    }, {}),
  );

  useEffect(() => {
    const fetchAndSetWindowsAndDisplays = async () => {
      try {
        setWindows(await listWindows(true));
        setDisplays(await listDisplays());
      } catch (error) {
        console.error(error);
        await showToast({ style: Toast.Style.Failure, title: String(error) });
      }
    };
    fetchAndSetWindowsAndDisplays().then();
  }, []);

  useEffect(() => {
    let _isComplete = true;
    for (const value of Object.values(cellWindowNumberMap)) {
      if (value === null) {
        _isComplete = false;
      }
    }
    setIsComplete(_isComplete);
  }, [cellWindowNumberMap]);

  const setWindowNumber = (cellIndex, windowNumber) => {
    setCellWindowNumberMap({
      ...cellWindowNumberMap,
      [cellIndex]: windowNumber,
    });
  };

  const getApplicationTitle = (index: number) => {
    const windowNumber = cellWindowNumberMap[index];

    return windowNumber === null ? null : formatWindowTitle(windows.filter((win) => win.number == windowNumber)[0]);
  };

  const getApplicationIcon = (index: number) => {
    const windowNumber = cellWindowNumberMap[index];

    return windowNumber === null ? null : windows.filter((win) => win.number == windowNumber)[0].icon;
  };

  const allIcons = Object.entries(cellWindowNumberMap).reduce((carry, _windowNumber, index) => {
    carry[index] = getApplicationIcon(index);
    return carry;
  }, {});

  return (
    <Grid
      columns={3}
      inset={Grid.Inset.Small}
      aspectRatio="16/9"
      filtering={false}
      navigationTitle="Cell"
      searchBarPlaceholder="Choose a cell"
    >
      {enumerateCells(layout.rows).map((cell, index) => (
        <Grid.Item
          key={`${cell.index}`}
          title={getApplicationTitle(index) ?? ""}
          content={layoutDefinitionsToSVG(layout, index, { [index]: getApplicationIcon(index) })}
          actions={
            <ActionPanel>
              <Action
                title="Select an Application"
                onAction={() =>
                  push(
                    <ChooseWindowOnCell
                      windows={windows}
                      cellIndex={cell.index}
                      setWindowNumber={setWindowNumber}
                      cellWindowNumberMap={cellWindowNumberMap}
                    />,
                  )
                }
              />
            </ActionPanel>
          }
        />
      ))}
      {isComplete &&
        displays.map((display) => (
          <Grid.Item
            key={`activate`}
            title={`Do Layout on Display ${display.id} [${display.width}x${display.height}]`}
            content={layoutDefinitionsToSVG(layout, "ok", allIcons)}
            actions={
              <ActionPanel>
                <Action title="Activate Layout" onAction={() => doLayout(layout.rows, display, cellWindowNumberMap)} />
              </ActionPanel>
            }
          />
        ))}
    </Grid>
  );
};
