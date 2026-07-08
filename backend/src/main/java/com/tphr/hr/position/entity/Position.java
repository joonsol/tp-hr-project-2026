package com.tphr.hr.position.entity;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Entity
@Table(name = "position")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Position extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id")
    private Long positionId;

    @Column(name = "position_name", nullable = false, length = 100)
    private String positionName;

    @Column(name = "level")
    private Integer level;

    public Position(String positionName, Integer level) {
        this.positionName = positionName;
        this.level = level;
    }

    public void update(String positionName, Integer level) {
        this.positionName = positionName;
        this.level = level;
    }
}
