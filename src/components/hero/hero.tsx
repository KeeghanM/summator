import { Example } from './example/example'

export function Hero() {
  return (
    <div className="hero min-h-[70vh] max-h-[70vh] overflow-hidden hero-gradient animate-bg bg-opacity-30">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-6xl font-bold">
            Get your <span className="bg-accent px-2">daily news</span> without
            the hassle.
          </h1>
          <p className="py-6 max-w-[80ch] text-xl">
            Sick of not knowing whats going on in the world? Too busy to keep up
            to date with everything? Summator is here to help. With just a
            couple RSS Feeds from sites you're interested in you can enrich your
            daily routine.
          </p>
          <button className="btn btn-primary text-white text-xl px-12">
            Make my life easier!
          </button>
        </div>
        <Example />
      </div>
    </div>
  )
}
