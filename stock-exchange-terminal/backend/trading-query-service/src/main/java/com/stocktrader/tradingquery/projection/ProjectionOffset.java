package com.stocktrader.tradingquery.projection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "projection_offsets")
public class ProjectionOffset {

    @Id
    private String projectionName;

    @Column(nullable = false)
    private long lastSequence;

    protected ProjectionOffset() {
    }

    public ProjectionOffset(String projectionName, long lastSequence) {
        this.projectionName = projectionName;
        this.lastSequence = lastSequence;
    }

    public String getProjectionName() {
        return projectionName;
    }

    public long getLastSequence() {
        return lastSequence;
    }

    public void setLastSequence(long lastSequence) {
        this.lastSequence = lastSequence;
    }
}

