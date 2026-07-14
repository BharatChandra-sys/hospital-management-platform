# Copyright 2024 Bodapati Bharat Chandra
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from sqlalchemy import String, Date, Time, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Appointment(Base, TimestampMixin):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"))
    doctor_id: Mapped[int] = mapped_column(ForeignKey("doctors.id", ondelete="CASCADE"))
    appointment_date: Mapped[str] = mapped_column(String(20), nullable=False)
    appointment_time: Mapped[str] = mapped_column(String(20), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=True)
    reason: Mapped[str] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    # SCHEDULED | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
    status: Mapped[str] = mapped_column(String(20), default="SCHEDULED")
    token_number: Mapped[int] = mapped_column(nullable=True)

    patient: Mapped["Patient"] = relationship("Patient", back_populates="appointments")
    doctor: Mapped["Doctor"] = relationship("Doctor", back_populates="appointments")
    bill: Mapped["Bill"] = relationship("Bill", back_populates="appointment", uselist=False)
