package com.nutspoker.controller

import com.nutspoker.controller.request.PutBreakRequest
import com.nutspoker.extesion.toBlindModel
import com.nutspoker.repository.BlindRepository
import com.nutspoker.service.BreakService
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/breaks")
class BreakController(
    private val breakService: BreakService,
    private val blindRepository: BlindRepository,
) {

    @PostMapping("/add")
    fun createNewBreak(@RequestHeader("X-Session-Id") sessionId: String){
        breakService.newBreak()
    }

    @PutMapping("/update/{id}")
    fun updateBreak(@PathVariable id: Int, @RequestBody breakUpdate: PutBreakRequest, @RequestHeader("X-Session-Id") sessionId: String){
        val breakPoker = blindRepository.findById(id).orElseThrow()
        breakService.update(breakUpdate.toBlindModel(breakPoker))
    }

}