package com.nutspoker.controller

import com.nutspoker.controller.request.PostParticipantRequest
import com.nutspoker.controller.request.PutParticipantRequest
import com.nutspoker.controller.response.ParticipantsShowResponse
import com.nutspoker.extesion.toParticipantModel
import com.nutspoker.extesion.toParticipantsShowResponse
import com.nutspoker.repository.ParticipantRepository
import com.nutspoker.service.ParticipantService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/participants")
class ParticipantController(
    private val participantService: ParticipantService,
    private val participantRepository: ParticipantRepository
) {

    @PostMapping("/create")
    fun createParticipant(@RequestBody @Valid participant: PostParticipantRequest, @RequestHeader("X-Session-Id") sessionId: String){
        participantService.create(participant.toParticipantModel())
    }

    @PutMapping("/update/{id}")
    fun updateParticipant(@RequestBody @Valid participant: PutParticipantRequest, @PathVariable id: Int, @RequestHeader("X-Session-Id") sessionId: String){
        val previousParticipant = participantRepository.findById(id).orElseThrow()
        participantService.update(participant.toParticipantModel(previousParticipant = previousParticipant))
    }

    @GetMapping("/shows")
    fun showParticipants(@RequestHeader("X-Session-Id") sessionId: String): List<ParticipantsShowResponse> {
        return participantService.show().map {it.toParticipantsShowResponse()}
    }

    @DeleteMapping("/delete/{id}")
    fun deleteParticipant(@PathVariable id: Int, @RequestHeader("X-Session-Id") sessionId: String){
        val participant = participantRepository.findById(id).orElseThrow()
        participantService.delete(participant)
    }





}



