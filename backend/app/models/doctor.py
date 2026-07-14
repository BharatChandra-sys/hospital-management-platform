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

from sqlalchemy import String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Doctor(Base, TimestampMixin):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    specialty: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    qualification: Mapped[str] = mapped_column(String(255), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    consultation_fee: Mapped[float] = mapped_column(Float, default=0.0)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    available_slots: Mapped[str] = mapped_column(Text, nullable=True)  # JSON string
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    is_available: Mapped[bool] = mapped_column(default=True)

    user: Mapped["User"] = relationship("User", back_populates="doctor_profile")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="doctor")
    prescriptions: Mapped[list["Prescription"]] = relationship("Prescription", back_populates="doctor")
    schedules: Mapped[list["DoctorSchedule"]] = relationship("DoctorSchedule", back_populates="doctor")
