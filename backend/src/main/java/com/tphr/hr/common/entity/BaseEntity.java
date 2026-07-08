package com.tphr.hr.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@Getter
@MappedSuperclass
public abstract class BaseEntity extends DeletableEntity {

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Override
    public void markDeleted() {
        super.markDeleted();
        this.active = false;
    }
}
