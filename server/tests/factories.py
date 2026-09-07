import factory
from faker import Factory as FakerFactory
from pytest_factoryboy import register

from api.user.models import User
from api.user.service import hash_password

faker = FakerFactory.create()


@register
@register(_name="second_user")
@register(_name="third_user")
class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    username: str = factory.LazyFunction(lambda: faker.first_name())
    email: str = factory.LazyFunction(lambda: faker.email())
    full_name: str = factory.LazyFunction(lambda: faker.name())
    disabled: bool = False
    hashed_password: str = factory.LazyFunction(lambda: hash_password(faker.word()))
