import Quartz
import Foundation
import CoreGraphics
import ArgumentParser

struct Window {
  var pid = 0
  var ownerName = ""
  var name = ""
  var x = 0
  var y = 0
  var width = 0
  var height = 0
  var number:UInt32 = 0
  var screen:UInt32 = 0

  func convertToDictionary() -> [String : Any] {
    return [
        "pid": self.pid,
        "ownerName": self.ownerName,
        "name": self.name,
        "x": self.x,
        "y": self.y,
        "width": self.width,
        "height": self.height,
        "number": self.number,
        "screen": self.screen
    ]
  }
}

func getWindows(onScreenOnly: Bool) -> [Window] {
  var windows: [Window] = []
  let displays:[Display] = getDisplays()

  var options = CGWindowListOption(arrayLiteral: CGWindowListOption.excludeDesktopElements)
  if onScreenOnly {
    options = CGWindowListOption(arrayLiteral: CGWindowListOption.excludeDesktopElements, CGWindowListOption.optionOnScreenOnly)
  }

  let windowList = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as! NSArray

  for window in windowList {
    let dict = (window as! NSDictionary)

    let minWinSize: Int = 50

    if (dict.value(forKey: "kCGWindowAlpha") as! Double) == 0 {
      continue;
    }

    let bounds = dict.value(forKey: "kCGWindowBounds") as! NSDictionary

    let x = bounds.value(forKey: "X")! as! Int
    let y = bounds.value(forKey: "Y")! as! Int
    let width = bounds.value(forKey: "Width")! as! Int
    let height = bounds.value(forKey: "Height")! as! Int

    if width < minWinSize || height < minWinSize {
      continue;
    }

    let pid = dict.value(forKey: "kCGWindowOwnerPID") as! Int

    var ownerName = ""
    if dict.value(forKey: "kCGWindowOwnerName") != nil {
      ownerName = dict.value(forKey: "kCGWindowOwnerName") as! String
    }

    var number:UInt32 = 0
    if dict.value(forKey: "kCGWindowNumber") != nil {
      number = dict.value(forKey: "kCGWindowNumber") as! UInt32
    }

    var name = ""
    if dict.value(forKey: "kCGWindowName") != nil {
      name = dict.value(forKey: "kCGWindowName") as! String
    }
    var screen:UInt32=0
    let windowRect = CGRect(x:x,y:y,width:width,height:height)
    for display in displays {
        if CGRectContainsRect(CGDisplayBounds(display.id), windowRect) {
            screen = display.id;
        }
    }
    windows.append(Window(
        pid: pid,
        ownerName: ownerName,
        name: name,
        x: x,
        y: y,
        width: width,
        height: height,
        number: number,
        screen: screen
    ))
  }

  return windows
}

func windowsToJson(windows: [Window]) -> String {
  do {
    let jsonData = try JSONSerialization.data(
        withJSONObject: windows.map { $0.convertToDictionary() },
        options: .prettyPrinted
    )
    let json = String(
        data: jsonData,
        encoding: String.Encoding.utf8
    )
    return json!
  } catch {
    return "[]"
  }
}
