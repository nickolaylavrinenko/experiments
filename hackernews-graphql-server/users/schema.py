import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import authenticate, get_user_model

from users.models import User


# COMMON


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


# QUERIES


def get_user(context):
    token = context.session.get('token')
    if not token:
        return

    try:
        user = User.objects.get(token=token)
        return user
    except:
        raise Exception('User not found!')


class Query(graphene.AbstractType):
    all_users = graphene.List(UserType)
    me = graphene.Field(UserType)

    def resolve_all_users(self, info):
        return User.objects.all()

    def resolve_me(self, info):
        user = get_user(info.context)
        if not user:
            raise Exception('Not logged!')
        return user


# MUTATIONS


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(cls, info, username, password, email):
        UserModel = get_user_model()
        user = UserModel(username=username, email=email)
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class SignInUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    @staticmethod
    def mutate(cls, info, username, password):
        user = authenticate(
            username=username,
            password=password,
        )
        if not user:
            raise Exception('Invalid username or password!')

        info.context.session['token'] = user.token

        return SignInUser(user=user)


class Mutation(graphene.AbstractType):
    create_user = CreateUser.Field()
    sign_in_user = SignInUser.Field()
