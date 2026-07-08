package com.tphr.hr.employmenttype.entity;

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
@Table(name = "employment_type")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmploymentType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employment_type_id")
    private Long employmentTypeId;

    @Column(name = "employment_type_name", nullable = false, length = 100)
    private String employmentTypeName;

    public EmploymentType(String employmentTypeName) {
        this.employmentTypeName = employmentTypeName;
    }

    public void update(String employmentTypeName) {
        this.employmentTypeName = employmentTypeName;
    }
}
