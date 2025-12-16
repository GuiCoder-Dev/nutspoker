package com.nutspoker.controller.request

import com.fasterxml.jackson.annotation.JsonAlias

data class PutBreakRequest(
    @JsonAlias("duration")
    var duration: Int?
)
