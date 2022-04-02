import { hash, verify, authenticateToken } from './auth.js'
import jwt from 'jsonwebtoken'

export default function (ogm, driver) {
  const User = ogm.model('User')
  const Post = ogm.model('Post')
  const Tag = ogm.model('Tag')
  console.log(createJWT({username:"test", userId:"8a4fac1a-aef9-44fb-a8d5-3ff57570ceb4", email:"test@test.test"}, "60h"))
  return {
    Mutation: {
      signUp: async (_source, { email, username, password }) => {
        const session = driver.session()
        try {
          const result = await session.run(
            `MATCH (u:User)
                      WHERE u.username = $username OR u.email = $email
                      RETURN u`,
            { username, email }
          )

          if (result.records.length == 0) {
            const user = await User.create({
              input: [
                {
                  username,
                  email,
                  password: await hash(password),
                },
              ],
            })
            return createUserToken(user)
          } else {
            var data = result.records[0]._fields[0].properties
            if (data.username == username)
              throw new Error(`User with username ${username} already exists!`)
            else throw new Error(`User with email ${email} already exists!`)
          }
        } finally {
          await session.close()
        }
      },
      signIn: async (_source, { usernameOrEmail, password }) => {
        const session = driver.session()
        try {
          const result = await session.run(
            `MATCH (u:User)
                      WHERE u.username = $usernameOrEmail OR u.email = $usernameOrEmail
                      RETURN u`,
            { usernameOrEmail }
          )

          if (result.records.length == 0) {
            throw new Error(
              `User with username/email ${usernameOrEmail} not found!`
            )
          }

          var data = result.records[0]._fields[0].properties
          console.log(data)
          if (! await verify(password, data.password)) {
            throw new Error(`Incorrect password for user  ${usernameOrEmail}!`)
          }
          return createUserToken(data)
        } finally {
          await session.close()
        }
      },
      refreshToken: async (_source, { refreshToken }) => {
        authenticateToken(refreshToken)
        var data = jwt.decode(refreshToken)
        return createUserTokenWithoutRefresh(data, refreshToken)
      },
      createPost: async (_source, { title, content, coords, tags, place,img }, context) => {
        var input =  {
          title,
          content,
          coords,
          createdBy: {
            connect: { where: { node: { userId: context.jwt.sub } } },
          },
        }
        if(img){
          input.img = img
        }
        if(place){
          input.place = {
            "connect": {
              "place": {
                "where": {
                  "node": {
                    "placeId": place
                  }
                }
              }
            }
          }
        }
        let post = await Post.create({
          input 
        })
        console.log("tags", tags)
        for(var name of tags){
          console.log(name)
          let tag = await Tag.find({
            where: {
              name: name,
            },
          })
          console.log("tag ", tag)
          if(tag.length == 0 )
            await await Tag.create({
              input:{name: name}
            })
          await Post.update({
            "where": { "postId": post.posts[0].postId },
            "update": {
              "tags": {
                  'connect': {
                    "where": { "node": { "name": name } }
                  }
                }
            },
          })
    
        }
        console.log("post" ,post,post.posts[0].postId)
        
        let selectionSet =`
        {
          postId
          title
          coords{
            latitude
            longitude
          }
          updatedAt
          createdAt
        }
        `
        // post = await Post.find({
        //   where: {
        //     "postId": post.posts[0].postId 
        //   },
        //   selectionSet
        // })
        // console.log(post)
        return {"success":true}
      },
    },
  }
}

function createUserToken(user) {
  return {
    accessToken: createJWT(user, '60m'),
    refreshToken: createJWT(user, '1h'),
    username: user.username,
  }
}
function createUserTokenWithoutRefresh(user, refreshToken) {
  return {
    accessToken: createJWT(user, '10m'),
    refreshToken: refreshToken,
    username: user.username,
  }
}

function createJWT(user, time) {
  return jwt.sign(
    {
      username: user.username,
      sub: user.userId,
      email: user.email,
    },
    process.env.GRAPHQL_SERVER_SECRET,
    { expiresIn: time }
  )
}


