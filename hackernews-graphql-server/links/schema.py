import graphene
from graphene_django import DjangoObjectType
from django.http import HttpResponseForbidden

from links.models import Link
from users.schema import get_user


# COMMON


class LinkType(DjangoObjectType):
    class Meta:
        model = Link


# QUERIES


class Query(graphene.AbstractType):
    all_links = graphene.List(LinkType)
    link = graphene.Field(
        LinkType,
        description="Get link by id",
        id=graphene.ID
    )

    def resolve_all_links(self, info):
        # request = info.context
        return Link.objects.all()

    def resolve_link(self, info, id):
        return Link.objects.get(pk=id)


# MUTATIONS


class CreateLink(graphene.Mutation):
    link = graphene.Field(LinkType)

    class Arguments:
        url = graphene.String()
        description = graphene.String()

    @staticmethod
    def mutate(cls, info, url, description):
        link = Link.objects.create(
            url=url,
            description=description,
            posted_by=user
        )
        return CreateLink(link=link)


class Mutation(graphene.AbstractType):
    create_link = CreateLink.Field()
