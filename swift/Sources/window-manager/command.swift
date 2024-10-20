import Quartz
import ArgumentParser


struct Command: ParsableCommand {
    static var configuration = CommandConfiguration(
        abstract: "A utility for performing windows manipulation.",
        subcommands: [MainDisplay.self, Displays.self, Windows.self],
        defaultSubcommand: Windows.self)
}

@main
extension Command {
    struct Displays: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return displays.")

        mutating func run() {
            print(displaysToJson(displays:getDisplays()));
        }
    }

    struct MainDisplay: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return main display.")

        mutating func run() {
            var mainID = CGMainDisplayID()
            print(mainID);
        }
    }

    struct Windows: ParsableCommand {
        static var configuration = CommandConfiguration(abstract: "return windows.")

        @Flag(name: [.long, .customShort("x")], help: "return onScreenOnly windows.")
        var onScreenOnly = false

        mutating func run() {
            print(windowsToJson(windows:getWindows(onScreenOnly: onScreenOnly)));
        }
    }
}
