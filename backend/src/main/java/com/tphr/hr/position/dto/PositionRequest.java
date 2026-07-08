package com.tphr.hr.position.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PositionRequest(
        @NotBlank(message = "직책명은 필수입니다.") @Size(max = 100) String positionName,
        Integer level
) {
}
