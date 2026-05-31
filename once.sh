#! /bin/bash

prompt=$(cat prompt.md)

claude --permission-mode acceptEdits \
    "Get issues from context and github repo. $prompt"