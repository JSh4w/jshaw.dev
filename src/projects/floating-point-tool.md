---
layout: project.njk
title: Floating Point Arithmetic Tool
order: 7
brief: Quick conversion tool for variable-width floating point numbers, built for hardware debugging.
link: https://jsh4w.github.io/
github: https://github.com/JSh4w/JSh4w.github.io
image: /assets/float_point_arithmetic_tool.png
tags: [javascript, floating-point, hardware]
---

Lightweight tool for converting and analyzing variable-width floating point numbers during hardware development.

## The Problem

Hardware engineers debugging FPUs and datapath components frequently need to convert between floating-point representations. Manual calculation is tedious and error-prone, especially with non-standard bit widths.

## Features

- **Variable Width Support**: Custom bit widths and configurable mantissa/exponent sizes
- **Multiple Representations**: Binary, hexadecimal, decimal, and scientific notation outputs
- **IEEE 754 Formats**: Built-in support for standard formats
- **Offline Ready**: Client-side JavaScript, no server required

## Use Cases

- Verify FPU outputs against expected results
- Debug floating-point arithmetic in custom processors
- Analyze precision loss in datapath operations
