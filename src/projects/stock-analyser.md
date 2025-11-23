---
layout: project.njk
title: Stock Analysis Platform [Deprecated]
order: 8
brief: MERN stack application with Kalman filter for next-day stock price prediction.
github: https://github.com/JSh4w/stock_analyser
image: /assets/stock_analysis.png
tags: [react, node.js, mongodb, machine-learning]
---

Full-stack stock viewing platform built to overcome limitations of existing providers.

## Motivation

Existing platforms had frustrating limitations: Trading212's restricted candle formats, Interactive Brokers' slow loading and authentication. Built my own solution to have more control over data visualization.

## Architecture

- **Frontend**: React.js
- **Backend**: Node.js & Express.js
- **Database**: MongoDB

## Technical Notes

Used API requests rather than WebSockets for simplicity. Implemented a Kalman filter for next-day price prediction - surprisingly effective despite limited knowledge of the underlying system dynamics.

A learning project for JavaScript and full-stack development.
