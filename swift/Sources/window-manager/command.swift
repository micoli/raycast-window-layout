import Quartz
import ArgumentParser

struct Command: ParsableCommand {
    static var configuration = CommandConfiguration(
        abstract: "A utility for performing windows manipulation.",
        subcommands: [MainDisplay.self, Displays.self, Windows.self, ResizeWindow.self],
        defaultSubcommand: Windows.self)
}

@main
extension Command {
    struct Displays: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return displays list.")

        mutating func run() {
            print(displaysToJson(displays: listDisplays()))
        }
    }

    struct MainDisplay: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return main display.")

        mutating func run() {
            let mainID = CGMainDisplayID()
            print(mainID)
        }
    }

    struct Windows: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return windows list.")

        @Flag(name: [.long, .customShort("x")], help: "return onScreenOnly windows.")
        var onScreenOnly = false

        mutating func run() {
            print(windowsToJson(windows: listWindows(onScreenOnly: onScreenOnly)))
        }
    }

    struct ResizeWindow: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "resize a window.")

        @Argument(help: "Window Number.")
        var number: Int = 0

        @Argument(help: "Position X.")
        var posX: Int = 0

        @Argument(help: "Position Y.")
        var posY: Int = 0

        @Argument(help: "Width.")
        var width: Int = 0

        @Argument(help: "Height.")
        var height: Int = 0

        @Flag(name: [.long, .customShort("t")], help: "set the window is the topmost window.")
        var topMost = false

        mutating func run() {
            print(resizeWindow(number: number, posX: posX, posY: posY, width: width, height: height,topMost: topMost))
        }
    }
}
