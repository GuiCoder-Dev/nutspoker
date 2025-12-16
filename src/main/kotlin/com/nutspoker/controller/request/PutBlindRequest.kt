package com.nutspoker.controller.request

import com.fasterxml.jackson.annotation.JsonAlias

data class PutBlindRequest(

    @JsonAlias("small_blind")
    var smallBlind: Int?,

    @JsonAlias("big_blind")
    var bigBlind: Int?,

    @JsonAlias("ante")
    var ante: Int?,

    @JsonAlias("duration")
    var duration: Int?
)
