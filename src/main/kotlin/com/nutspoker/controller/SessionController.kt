package com.nutspoker.controller

import com.nutspoker.service.SessionService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/session")
class SessionController(
    private val sessionService: SessionService
) {

    @PostMapping("/start")
    fun startSession() {
        val sessionId = UUID.randomUUID().toString()
        sessionService.generateDefaultBlinds()
    }

}