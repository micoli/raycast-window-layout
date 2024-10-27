import Quartz
import Foundation
import CoreGraphics
import ArgumentParser
import Darwin

struct Window {
  var pid: Int32 = 0
  var ownerName = ""
  var name = ""
  var posX = 0
  var posY = 0
  var width = 0
  var height = 0
  var number: UInt32 = 0
  var screen: UInt32 = 0
  var icon = ""

  func convertToDictionary() -> [String: Any] {
    return [
        "pid": self.pid,
        "ownerName": self.ownerName,
        "name": self.name,
        "x": self.posX,
        "y": self.posY,
        "width": self.width,
        "height": self.height,
        "number": self.number,
        "screen": self.screen,
        "icon": self.icon
    ]
  }
}

extension CGImage {
    func resize(size:CGSize) -> CGImage? {
        let width: Int = Int(size.width)
        let height: Int = Int(size.height)

        let bytesPerPixel = self.bitsPerPixel / self.bitsPerComponent
        let destBytesPerRow = width * bytesPerPixel


        guard let colorSpace = self.colorSpace else { return nil }
        guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: self.bitsPerComponent, bytesPerRow: destBytesPerRow, space: colorSpace, bitmapInfo: self.alphaInfo.rawValue) else { return nil }

        context.interpolationQuality = .high
        context.draw(self, in: CGRect(x: 0, y: 0, width: width, height: height))

        return context.makeImage()
    }
}

extension NSImage {
    func base64String() -> String? {
        if let cgImage = self.cgImage(forProposedRect: nil, context: nil, hints: nil)?.resize(size: CGSize(width: 32,height: 32)){
            let bitmapRep = NSBitmapImageRep(cgImage: cgImage)
            let pngData = bitmapRep.representation(using: NSBitmapImageRep.FileType.png, properties: [:])!
            return "data:image/png;base64, "+pngData.base64EncodedString()
        }
        return nil
    }
}

func listWindows(onScreenOnly: Bool) -> [Window] {
  var windows: [Window] = []
  let displays: [Display] = listDisplays()

  var options = CGWindowListOption(arrayLiteral: CGWindowListOption.excludeDesktopElements)
  if onScreenOnly {
    options = CGWindowListOption(arrayLiteral: CGWindowListOption.excludeDesktopElements, CGWindowListOption.optionOnScreenOnly)
  }

  let windowList = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as! NSArray

  for window in windowList {
    let dict = (window as! NSDictionary)


    let minWinSize: Int = 50

    if (dict.value(forKey: "kCGWindowAlpha") as! Double) == 0 {
      continue
    }

    let bounds = dict.value(forKey: "kCGWindowBounds") as! NSDictionary

    let posX = bounds.value(forKey: "X")! as! Int
    let posY = bounds.value(forKey: "Y")! as! Int
    let width = bounds.value(forKey: "Width")! as! Int
    let height = bounds.value(forKey: "Height")! as! Int

    if width < minWinSize || height < minWinSize {
      continue
    }

    let pid = dict.value(forKey: "kCGWindowOwnerPID") as! Int32

    var ownerName = ""
    if dict.value(forKey: "kCGWindowOwnerName") != nil {
      ownerName = dict.value(forKey: "kCGWindowOwnerName") as! String
    }

    let app = NSRunningApplication(processIdentifier: pid)
    var icon = ""
    if let appIcon = app?.icon {
        icon = appIcon.base64String() ?? ""
    }
    var number: UInt32 = 0
    if dict.value(forKey: "kCGWindowNumber") != nil {
      number = dict.value(forKey: "kCGWindowNumber") as! UInt32
    }

    var name = ""
    if dict.value(forKey: "kCGWindowName") != nil {
      name = dict.value(forKey: "kCGWindowName") as! String
    }

    var screen: UInt32 = 0
    let windowRect = CGRect(x: posX, y: posY, width: width, height: height)
    for display in displays where CGRectContainsRect(CGDisplayBounds(display.id), windowRect) {
        screen = display.id
    }

    windows.append(Window(
        pid: pid,
        ownerName: ownerName,
        name: name,
        posX: posX,
        posY: posY,
        width: width,
        height: height,
        number: number,
        screen: screen,
        icon: icon
    ))
  }

  return windows
}

func resizeWindow(number: Int, posX: Int, posY: Int, width: Int, height: Int) -> String {

    for entry  in listWindows(onScreenOnly: true)
    {
        if entry.number != number {
            continue
        }
        let appRef = AXUIElementCreateApplication(entry.pid);

        var value: AnyObject?
        _ = AXUIElementCopyAttributeValue(appRef, kAXWindowsAttribute as CFString, &value)
        if let windowList = value as? [AXUIElement] {
            if windowList.first == nil {
                continue
            }
            var newPoint = CGPoint(x: posX, y: posY)
            var newSize = CGSize(width: width, height: height)

            AXUIElementSetAttributeValue(
                windowList.first!,
                kAXPositionAttribute as CFString,
                AXValueCreate(AXValueType(rawValue: kAXValueCGPointType)!,&newPoint)!
            );

            AXUIElementSetAttributeValue(
                windowList.first!,
                kAXSizeAttribute as CFString,
                AXValueCreate(AXValueType(rawValue: kAXValueCGSizeType)!,&newSize)!
            );
        }
    }

    return ""
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
