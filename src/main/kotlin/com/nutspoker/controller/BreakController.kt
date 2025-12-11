package com.nutspoker.controller

import com.nutspoker.service.BreakService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/breaks")
class BreakController(
    private val breakService: BreakService
) {

    @PostMapping("/add")
    fun createNewBreak(){
        breakService.newBreak()
    }

}