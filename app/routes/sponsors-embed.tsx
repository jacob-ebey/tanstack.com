import SponsorPack from '../components/SponsorPack'
import { HeadersFunction, json, LoaderFunction, useLoaderData } from 'remix'
import { tw } from 'twind'

export const handle = {
  baseParent: true,
}

export const loader: LoaderFunction = async () => {
  const { getSponsorsAndTiers } = require('../server/sponsors')

  let { sponsors } = await getSponsorsAndTiers()

  sponsors = sponsors.filter((d) => d.privacyLevel === 'PUBLIC')

  return json(
    {
      sponsors,
    },
    {
      headers: {
        'Cache-Control': 'max-age=300, s-maxage=3600, stale-while-revalidate',
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
  }
}

export default function Sponsors() {
  const { sponsors } = useLoaderData()

  return (
    <>
      <div
        className={tw`h-screen w-screen flex items-center justify-center overflow-hidden`}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
        html, body {
          background: transparent;
        }
      `,
          }}
        />
        <SponsorPack sponsors={sponsors} />
      </div>
    </>
  )
}
