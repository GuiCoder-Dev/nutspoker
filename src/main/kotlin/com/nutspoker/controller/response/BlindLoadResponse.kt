package com.nutspoker.controller.response

data class BlindLoadResponse(
    val level: Int,
    val smallBlind: Int,
    val bigBlind: Int,
    val ante: Int,
    val duration: Int,
)
