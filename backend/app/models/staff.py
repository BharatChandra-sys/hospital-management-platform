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

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class Staff(Base, TimestampMixin):
    __tablename__ = "staff"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    shift: Mapped[str] = mapped_column(String(20), nullable=True)  # MORNING | EVENING | NIGHT
    join_date: Mapped[str] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE")  # ACTIVE | ON_LEAVE | INACTIVE
