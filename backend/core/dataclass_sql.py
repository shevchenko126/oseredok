from typing import TYPE_CHECKING

if TYPE_CHECKING:
    # noinspection PyUnresolvedReferences
    from dataclasses import dataclass as dataclass_sql
else:

    def dataclass_sql(cls):
        return cls