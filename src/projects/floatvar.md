---
layout: project.njk
title: FloatVar
order: 2
brief: Web tool for variable-width floating point conversion with RNE rounding. Supports decimal, hex and binary inputs.
link: https://floatvar.netlify.app/
image: /assets/floatvar.png
tags: [javascript, floating-point, web-app]
---

Web application for visualizing and converting variable-width floating-point values using Round-to-Nearest-Even (RNE) rounding.

## Features

- **Multiple Input Formats**: Decimal, hexadecimal, and binary inputs with toggle switching
- **Custom Bit Widths**: Support for non-standard floating-point formats beyond IEEE 754
- **Real-time Conversion**: Instant feedback as values are modified
- **Custom Data Structure**: Built on a `floatXRNE` implementation optimized for variable-width operations

## Use Cases

- **Hardware Development**: Testing datapath components with specific floating-point formats
- **Education**: Understanding floating-point representation and rounding behavior
- **Debugging**: Analyzing floating-point behavior in custom formats
