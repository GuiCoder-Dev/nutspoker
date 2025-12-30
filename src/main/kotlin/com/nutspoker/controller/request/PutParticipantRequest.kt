package com.nutspoker.controller.request

import com.fasterxml.jackson.annotation.JsonAlias
import com.nutspoker.enuns.Payment
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.math.BigDecimal

data class PutParticipantRequest(

    @JsonAlias("player")
    val player: String? = null,

    @JsonAlias("buy_in")
    val buyIn: BigDecimal? = null,

    @JsonAlias("quantity_rebuy")
    val quantityRebuy: Int? = null,

    @JsonAlias("value_rebuy")
    val valueRebuy: BigDecimal? = null,

    @JsonAlias("add_on")
    val addOn: BigDecimal? = null,

    @JsonAlias("payment")
    @Enumerated(EnumType.STRING)
    val payment: Payment? = null,

    @JsonAlias("position")
    val position: Int? = null,
)
