import { Footer } from '@/components/shell/Footer'
import { MobileTabBar } from '@/components/shell/MobileTabBar'
import { Navbar } from '@/components/shell/Navbar'
import { SetupNotice } from '@/components/shell/SetupNotice'
import { requireUser } from '@/lib/auth/session'
import { isTmdbConfigured } from '@/lib/tmdb'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <>
      <Navbar user={{ name: user.name, email: user.email }} />
      <main id="main" className="min-h-dvh">
        {isTmdbConfigured() ? children : <SetupNotice />}
      </main>
      <Footer className="pb-24 md:pb-0" />
      <MobileTabBar />
    </>
  )
}
