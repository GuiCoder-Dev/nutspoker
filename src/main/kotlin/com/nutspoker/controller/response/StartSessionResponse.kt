package com.nutspoker.controller.response

import com.nutspoker.model.BlindModel

data class StartSessionResponse(
    val sessionId: String,
    val defaultBlinds: List<BlindModel>
)


