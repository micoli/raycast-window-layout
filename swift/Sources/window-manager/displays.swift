import Quartz
import Foundation
import CoreGraphics
import ArgumentParser

struct Display {
  var id:UInt32 = 0
  var x = 0
  var y = 0
  var width = 0
  var height = 0

  func convertToDictionary() -> [String : Any] {
    return [
        "id": self.id,
        "x": self.x,
        "y": self.y,
        "width": self.width,
        "height": self.height
    ]
  }
}

func getDisplays() -> [Display] {
    let maxDisplays: UInt32 = 16
    var onlineDisplays = [CGDirectDisplayID](repeating: 0, count: Int(maxDisplays))
    var displayCount: UInt32 = 0

    let dErr = CGGetOnlineDisplayList(maxDisplays, &onlineDisplays, &displayCount)

    var displays: [Display] = []

    for currentDisplay in onlineDisplays[0..<Int(displayCount)] {
        displays.append(Display(
            id:currentDisplay,
            width:CGDisplayPixelsHigh(currentDisplay),
            height:CGDisplayPixelsWide(currentDisplay)
        ))
    }
    return displays;
}

func displaysToJson(displays: [Display]) -> String {
  do {
    let jsonData = try JSONSerialization.data(
        withJSONObject: displays.map { $0.convertToDictionary() },
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
