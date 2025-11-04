import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { detectDeviceLocation } from '../services/location/detector';
import { fetchCountryForCoordinates } from '../services/location/reverseCountry';
import { useAntipodeSearch } from '../hooks/useAntipodeSearch';
import type { AntipodeLocation } from '../types/antipode';
import { PostcardGraphic } from '../components/postcard/PostcardGraphic';

const AntipodeGlobe = dynamic(
  () =>
    import('../components/globe/AntipodeGlobe').then(
      (module) => module.AntipodeGlobe,
    ),
  { ssr: false },
);

export default function HomePage() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [antipodeCountry, setAntipodeCountry] = useState<string | null>(null);
  const [isResolvingCountry, setIsResolvingCountry] = useState(false);
  const [showPostcardCta, setShowPostcardCta] = useState(false);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    data,
    mutateAsync: search,
    isPending: isSearching,
  } = useAntipodeSearch();

  const antipodeLocation: AntipodeLocation | undefined = data?.antipode;
  const antipodeLatitude = antipodeLocation?.latitude;
  const antipodeLongitude = antipodeLocation?.longitude;
  const antipodeLabel = antipodeLocation?.label;

  const antipodeCoordinatesKey =
    typeof antipodeLatitude === 'number' && typeof antipodeLongitude === 'number'
      ? `${antipodeLatitude},${antipodeLongitude}`
      : null;

  useEffect(() => {
    let isActive = true;

    if (antipodeCoordinatesKey === null || antipodeLatitude === undefined || antipodeLongitude === undefined) {
      setAntipodeCountry(null);
      setIsResolvingCountry(false);
      return () => {
        isActive = false;
      };
    }

    setIsResolvingCountry(true);
    const resolvedLatitude = antipodeLatitude as number;
    const resolvedLongitude = antipodeLongitude as number;

    fetchCountryForCoordinates(resolvedLongitude, resolvedLatitude)
      .then((country) => {
        if (!isActive) {
          return;
        }
        setAntipodeCountry(country);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }
        setAntipodeCountry(null);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }
        setIsResolvingCountry(false);
      });

    return () => {
      isActive = false;
    };
  }, [antipodeCoordinatesKey, antipodeLatitude, antipodeLongitude]);

  async function handleDetectClick() {
    setIsDetecting(true);
    setShowPostcardCta(true);
    setRegisterMessage(null);
    try {
      const location = await detectDeviceLocation();
      const response = await search({
        location: {
          device: location,
        },
        clientMetadata: {
          trigger: 'device-detect',
        },
      });
      if (!response.antipode) {
        setRegisterMessage('We could not determine the antipode location yet. Try again.');
      }
    } catch (error) {
      setRegisterMessage('Unable to detect location. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  }

  function handleRegisterInterestClick() {
    window.open('https://forms.gle/B1HLGFFKztmpv28G7', '_blank', 'noopener,noreferrer');
    setRegisterMessage('Opening registration form in a new tab…');
  }

  const hasAntipode = antipodeCoordinatesKey !== null;
  const countryDisplay = hasAntipode
    ? isResolvingCountry
      ? 'Locating country…'
      : antipodeCountry ?? 'Unknown location'
    : null;

  useEffect(() => {
    if (hasAntipode) {
      setShowPostcardCta(true);
    }
  }, [hasAntipode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, [showPostcardCta]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = 0.4;
    audio
      .play()
      .catch(() => {
        // Autoplay may fail until the user interacts with the page.
      });
  }, []);

  function handleToggleMusic() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextMuted = !isMusicMuted;
    setIsMusicMuted(nextMuted);
    audio.muted = nextMuted;

    if (!nextMuted) {
      audio
        .play()
        .catch(() => {
          setIsMusicMuted(true);
          audio.muted = true;
        });
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #f8fafc 100%)',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx global>{`
        .caveat-title {
          font-family: "Caveat", cursive;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      <audio
        ref={audioRef}
        src="/audio/Golden-Hour-chosic.com_.mp3"
        autoPlay
        loop
        muted={isMusicMuted}
      />
      <section
        style={{
          display: 'flex',
          flexDirection: showPostcardCta ? 'row' : 'column',
          flexWrap: 'nowrap',
          width: '100%',
          minHeight: '100vh',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: showPostcardCta ? '1 1 60%' : '1 1 100%',
            minHeight: '100vh',
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            transition: 'flex 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <button
            type="button"
            onClick={handleToggleMusic}
            style={{
              position: 'absolute',
              bottom: '2rem',
              right: '2rem',
              zIndex: 3,
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.72)',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.5)',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'transform 0.2s ease, background 0.2s ease',
            }}
            aria-label={isMusicMuted ? 'Play music' : 'Mute music'}
          >
            <span className="sr-only">{isMusicMuted ? 'Play music' : 'Mute music'}</span>
            {isMusicMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '22px', height: '22px' }}
              >
                <path d="M9 9v6H6l-3 3V6l3 3h3z" />
                <line x1="16" y1="9" x2="22" y2="15" />
                <line x1="22" y1="9" x2="16" y2="15" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '22px', height: '22px' }}
              >
                <path d="M9 9v6H6l-3 3V6l3 3h3z" />
                <path d="M19 5a7 7 0 0 1 0 14" />
                <path d="M16 8a4 4 0 0 1 0 8" />
              </svg>
            )}
          </button>

          <AntipodeGlobe
            antipode={
              antipodeLocation
                ? {
                    latitude: antipodeLocation.latitude,
                    longitude: antipodeLocation.longitude,
                    label: antipodeLocation.label,
                  }
                : undefined
            }
            isAnimating={!isSearching}
            height="100%"
            layoutKey={showPostcardCta ? 'compact' : 'full'}
          />

          {!showPostcardCta ? (
            <div
              style={{
                position: 'absolute',
                top: '3rem',
                left: '3rem',
                right: 'auto',
                color: '#f8fafc',
                maxWidth: '460px',
                padding: '0 1.5rem 2rem 0',
                pointerEvents: 'none',
                textAlign: 'left',
              }}
            >
              <h1
                className="caveat-title"
                style={{ marginBottom: '1rem', fontSize: '2.75rem', lineHeight: 1.12 }}
              >
                Have you ever met someone on the opposite side of the world?
              </h1>
              <p
                className="caveat-title"
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#dbeafe',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                }}
              >
                {`The world is home to 8 billion of us. We were born in a place we call home and most of us live, build, dream and die near it. We travel, but seldom to far-flung lands, let alone to the furthest distance away from us - the antipode. Every location on Earth has a corresponding antipode - the part of Earth directly opposite. 

This project was inspired because I am someone lucky enough to have travelled to my antipode. It was there I learnt another language, roamed another city's streets, and experienced a history and culture so different from my own. It was there I helped to rebuild someone's home with a group of strangers, witnessed a grandmother cry tears of joy as she took turns dancing with every one in the room at a party for family and friends, most of whom were migrant workers who would only return home in another year or two.`}
              </p>
            </div>
          ) : null}

          {!showPostcardCta ? (
            <div
              style={{
                position: 'absolute',
                top: '3rem',
                right: '3rem',
                color: '#f8fafc',
                maxWidth: '460px',
                padding: '0 0 2rem 1.5rem',
                pointerEvents: 'none',
                textAlign: 'left',
              }}
            >
              <p
                className="caveat-title"
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#dbeafe',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                }}
              >
                {`Having gone to the other end of the world and back has changed me - but not in the original life-changing way that I ever thought or imagined. For all the differences in history, culture, ethnicity, food, dance and music, we shared even more in our shared humanity. We laugh and tear the same, long for happiness and peace, and agonize over loss, suffering as the sun rises and sets on our homes and countries - in lockstep, a 12-hour difference - every single day.

I hope this project brings people in a way that transcends geographical distances - literally the farthest one possible. And that it brings comfort and glow, no matter how small, that people living across the world from you are also facing their own unique challenges and choosing to live their life's fullest, just like you are.`}
              </p>
            </div>
          ) : null}

          {hasAntipode ? (
            <div
              style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.7)',
                color: '#f8fafc',
                padding: '0.85rem 1.75rem',
                borderRadius: '999px',
                fontWeight: 600,
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                textAlign: 'center',
                minWidth: '240px',
              }}
            >
              <span>{antipodeLabel ?? 'Opposite point'}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {countryDisplay ? `Country: ${countryDisplay}` : null}
              </span>
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                bottom: '3rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#f8fafc',
                textAlign: 'center',
              }}
            >
              <button
                type="button"
                onClick={handleDetectClick}
                disabled={isDetecting || isSearching}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#f8fafc',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.4)',
                  cursor: isDetecting || isSearching ? 'wait' : 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
                aria-label="Enable location access"
              >
                {isDetecting ? 'Detecting…' : 'Enable location access'}
              </button>
              <span
                className="caveat-title"
                style={{ fontSize: '1rem', color: '#dbeafe' }}
              >
                to find your antipode and to find a person living at your antipode.
              </span>
            </div>
          )}
        </div>

        {showPostcardCta ? (
          <aside
            style={{
              flex: '1 1 40%',
              minHeight: showPostcardCta ? '100vh' : 'auto',
              height: '100%',
              background:
                'linear-gradient(180deg, rgba(248, 244, 237, 0.85) 0%, rgba(251, 247, 240, 0.95) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 2rem',
              opacity: showPostcardCta ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out 0.3s, flex 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.75rem',
                textAlign: 'center',
                color: '#1f2937',
              }}
            >
              <div style={{ width: '100%', maxWidth: '320px' }}>
                <PostcardGraphic />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <p
                  className="caveat-title"
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    color: '#1f2937',
                    lineHeight: 1.45,
                  }}
                >
                  Whenever someone from your antipode is found, we can help to arrange for
                  postcard delivery for a small fee. Likewise, it helps someone from your antipode find you too.
                </p>

                <button
                  type="button"
                  onClick={handleRegisterInterestClick}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0.875rem 2.25rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  Register interest
                </button>
              </div>

              {registerMessage ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: '#374151',
                  }}
                >
                  {registerMessage}
                </p>
              ) : null}
            </div>
          </aside>
        ) : null}
      </section>
    </main>
  );
}
