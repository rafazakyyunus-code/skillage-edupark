import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ───────── HOME ───────── */
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";
import Tentangkami from "./pages/TentangKami/Tentangkami";

/* ───────── PUBLIC PAGES ───────── */
import Gallery from "./pages/gallery/Gallery";
import GalleryDetail from "./pages/gallery/GalleryDetail";
import Produk from "./pages/semuaProduk/Index";
import ProdukDetail from "./pages/semuaProduk/ProdukDetail";
import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/VenueWorkshop";
import Peternakan from "./pages/program/Peternakan";
import VenueAlam from "./pages/venue/VenueAlam";
import VenueDetail from "./pages/venue/VenueDetail";
import Article from "./pages/article/Article";
import ArticleDetail from "./pages/articleDetail/ArticleDetail";
import AttractionDetail from "./pages/Etiket/AttractionDetail";

/* ───────── E-TIKET ───────── */
import ETicket from "./pages/Etiket/ETicket";
import Attractions from "./pages/Etiket/Attractions";
import TicketsOnline from "./pages/Etiket/TicketsOnline";

/* ───────── Promo ───────── */
import Promo from "./pages/promo/Promo";

/* ───────── DASHBOARD ───────── */
import CreateArticle from "./pages/dashboard/CreateArticle";
import Editor from "./pages/dashboard/Editor";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ContactPage from "./pages/contact/ContactPage";

/* ───────── LOGIN & AUTH ───────── */
import Login from "./pages/auth/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute, { WaitingApprovalPage } from "./components/ProtectedRoute";

/* ───────── FIREBASE ───────── */
import { db } from "./firebase";
import { ref, onValue, set, update } from "firebase/database";

/* ───────── FRAMER MOTION WRAPPER ───────── */
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── CUSTOM HOOK FIREBASE ───────── */
function useArticles() {
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const articlesRef = ref(db, "articles");

    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setAllArticles(list);
      } else {
        setAllArticles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addArticle = async (newArticle) => {
    const articleId = `art_${Date.now()}`;
    const { id: _ignore, ...cleanArticle } = newArticle;

    await set(ref(db, `articles/${articleId}`), {
      ...cleanArticle,
      id: articleId,
    });
  };

  const updateStatus = async (articleId, newStatus, feedback = "") => {
    await update(ref(db, `articles/${articleId}`), {
      status: newStatus,
      feedback,
    });

    console.log(`Firebase Update: ${newStatus}`, articleId);
  };

  return {
    articles: allArticles,
    addArticle,
    updateStatus,
  };
}

/* ───────── CUSTOM HOOK FIREBASE TICKETS ───────── */
function useTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const ticketsRef = ref(db, "ticketsOnline");

    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTickets(list);
      } else {
        setTickets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return { tickets };
}

/* ───────── APP INNER (pakai useAuth) ───────── */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
}

function AppInner() {
  const location = useLocation();
  const { user } = useAuth();

  const { articles, addArticle, updateStatus } = useArticles();
  const { tickets } = useTickets();

  /* Hide navbar/footer di halaman login & dashboard */
  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/login" ||
    location.pathname === "/waiting-approval";

return (
  <div className="min-h-screen w-full overflow-x-hidden bg-white">
    <ScrollToTop />

    {!hideLayout && <Navbar />}

    <main className="w-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* HOME */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Hero />
                <About />
                <WhyChoose tickets={tickets} />
                <ProductSection />
                <ProgramSection />
                <GallerySection />
                <CTA />
              </AnimatedPage>
            }
          />

          {/* ───────── LOGIN ───────── */}
          <Route
            path="/login"
            element={
              user
                ? (
                    user.role === 'admin'
                      ? <Navigate to="/dashboard/admin" replace />
                      : user.role === 'writer'
                        ? <Navigate to="/dashboard/create-article" replace />
                        : user.role === 'editor'
                          ? <Navigate to="/dashboard/editor" replace />
                          : <Navigate to="/waiting-approval" replace />  // pending
                  )
                : <Login />
            }
          />

          <Route
            path="/tentang-kami"
            element={
              <AnimatedPage>
                <Tentangkami />
              </AnimatedPage>
            }
          />

          <Route
            path="/contact"
            element={
              <AnimatedPage>
                <ContactPage />
              </AnimatedPage>
            }
          />

          {/* E-TIKET */}
          <Route
            path="/e-tiket"
            element={
              <AnimatedPage>
                <ETicket />
              </AnimatedPage>
            }
          />

                  <Route
          path="/tickets-online"
          element={
            <AnimatedPage>
              <TicketsOnline />
            </AnimatedPage>
          }
        />
                  <Route
          path="/promo"
          element={
            <AnimatedPage>
              <Promo />
            </AnimatedPage>
          }
        />


          <Route
            path="/attractions"
            element={
              <AnimatedPage>
                <Attractions />
              </AnimatedPage>
            }
          />

            <Route
            path="/attractions/:id"
            element={
              <AnimatedPage>
                <AttractionDetail />
              </AnimatedPage>
            }
          />

          {/* GALLERY */}
          <Route
            path="/gallery"
            element={
              <AnimatedPage>
                <Gallery />
              </AnimatedPage>
            }
          />

          <Route
            path="/gallery/:id"
            element={
              <AnimatedPage>
                <GalleryDetail />
              </AnimatedPage>
            }
          />

          {/* PROGRAM */}
          <Route
            path="/program/hydroponic"
            element={
              <AnimatedPage>
                <Hydroponic />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/venue-workshop"
            element={
              <AnimatedPage>
                <VenueWorkshop />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/peternakan"
            element={
              <AnimatedPage>
                <Peternakan />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/venue-alam"
            element={
              <AnimatedPage>
                <VenueAlam />
              </AnimatedPage>
            }
          />

          <Route
            path="/venue/:id"
            element={
              <AnimatedPage>
                <VenueDetail />
              </AnimatedPage>
            }
          />

          {/* PRODUK */}
          <Route
            path="/produk"
            element={
              <AnimatedPage>
                <Produk />
              </AnimatedPage>
            }
          />

          <Route
            path="/produk/kategori/:kategori"
            element={
              <AnimatedPage>
                <Produk />
              </AnimatedPage>
            }
          />

          <Route
            path="/produk/:id"
            element={
              <AnimatedPage>
                <ProdukDetail />
              </AnimatedPage>
            }
          />

          {/* ARTICLE */}
          <Route
            path="/article"
            element={
              <AnimatedPage>
                <Article articles={articles} />
              </AnimatedPage>
            }
          />

          <Route
            path="/article/:id"
            element={
              <AnimatedPage>
                <ArticleDetail articles={articles} />
              </AnimatedPage>
            }
          />

          {/* ───────── DASHBOARD (Protected) ───────── */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/create-article"
            element={
              <ProtectedRoute allowedRoles={["admin", "writer"]}>
                <CreateArticle onExternalSubmit={addArticle} currentUser={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/editor"
            element={
              <ProtectedRoute allowedRoles={["admin", "editor"]}>
                <Editor
                  externalArticles={articles}
                  onUpdateStatus={updateStatus}
                  currentUser={user}
                />
              </ProtectedRoute>
            }
          />

          {/* ───────── WAITING APPROVAL (role: pending) ───────── */}
          <Route
            path="/waiting-approval"
            element={
              <ProtectedRoute allowedRoles={["pending"]}>
                <WaitingApprovalPage />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<h1>404 Not Found</h1>} />

        </Routes>
      </AnimatePresence>
    </main>

    {!hideLayout && <Footer />}
  </div>
);
}

/* ───────── APP ROOT (wrap AuthProvider) ───────── */
function App() {
  return (
    <AuthProvider>
      <div className="w-full min-h-screen overflow-x-hidden">
        <AppInner />
      </div>
    </AuthProvider>
  );
}

export default App;