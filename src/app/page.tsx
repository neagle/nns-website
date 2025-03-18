import FeaturedShow from "@/app/components/FeaturedShow";
// import classnames from "classnames";
// import Facebook from "@/app/components/Facebook";
// import Instagram from "@/app/components/Instagram";

export default function Home() {
  return (
    <div className="bg-base-100 h-full">
      <FeaturedShow />
      {/* Placeholder for potential social media widgets */}
      {/* <div>
        <div className="facebook">
          <Facebook />
        </div>
        <div className="instagram">
          <Instagram />
        </div>
      </div> */}
    </div>
  );
}
