# SS scanner

A simple and easy to use tool that watches your SS scans of solar bodies and saves them in raw and spreadsheet friendly formats 

## How to use

Simply download the **SS-scanner** zip, extract it and run **SS-scanner.exe**. Program will do it's initial configuration and then the sniffer will start.

To start scanning simply warp to the system you wish to scan and start scanning. Program console will tell you everything else you need.

## How to compile yourself

If you want to compile this project for yourself (for example for Linux) simply download the project and use **pkg .\package.json --options no-warnings** with --targets argument.

You'll need to copy **cap.node** from **_node_modules\cap\build\Release_** to the directory with executable for it to work.
