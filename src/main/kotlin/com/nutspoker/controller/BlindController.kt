package com.nutspoker.controller

import com.nutspoker.service.BlindService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/blinds")
class BlindController(
    private val blindService: BlindService
) {

    @PostMapping("/add")
    fun createNewBlind(){
        blindService.newBlind()
    }
}