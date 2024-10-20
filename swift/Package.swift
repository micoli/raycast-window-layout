// swift-tools-version:5.7
import PackageDescription

let package = Package(
  name: "WindowManager",
  platforms: [
	.macOS(.v13)
  ],
  dependencies: [
    .package(url: "https://github.com/apple/swift-argument-parser", from: "1.3.0"),
    .package(url: "https://github.com/SimplyDanny/SwiftLintPlugins", from: "0.57.0"),
  ],
  targets: [
        .executableTarget(
            name: "window-manager",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),

            ],
            plugins: [.plugin(name: "SwiftLintBuildToolPlugin", package: "SwiftLintPlugins")]
        ),
  ]
)
