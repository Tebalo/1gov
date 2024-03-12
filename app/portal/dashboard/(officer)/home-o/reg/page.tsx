import CaseDetails from "@/app/components/case/casedetails";
//import Utilities from "@/app/components/case/utilities";
import WorkArea from "@/app/components/case/workarea";
import { getNext } from "@/app/lib/actions";
import Link from "next/link";
import { redirect } from 'next/navigation'

const Page: React.FC = async () => {
    //revalidate('work')
    const work = await getNext('Pending-Review')
    const filepath = 'http://66.179.253.57/Qualifications/'
    if(!work){
      redirect('/portal/dashboard/home-o/')
    }

    const details = {
        'status': work.reg_status ?? '',
        'type': work.registration_type ?? '',
        'id': work.national_id ?? '',
        'createdBy': work.forenames +' '+ work.surname ?? '',
        'createdAt': work.created_at ?? '',
        'updatedAt': work.updated_at ?? '',
    }
    const studentDetails = {
        'institutionRecommendations': {
            'recommended': work.recommended ?? '', 
            'attachment': work.attachment ?? ''
          },
          'bio': {
            'surname': work.surname ?? '',
            'forenames': work.forenames ?? '',
            'dob': work.dob ?? '',
            'pob': work.pob ?? '',
            'gender': work.gender ?? '',
            'nationality': work.nationality ?? '',
            'postalAddress': work.postal_address ?? '',
            'physicalAddress': work.physical_address ?? '',
            'email': work.email ?? '',
            'mobile': work.mobile ?? '',
            'maritalStatus': work.marital_status ?? '',
            'nextOfKinName': work.next_of_kin_name ?? '',
            'nextOfKinRelation': work.next_of_kin_relation ?? '',
            'nextOfKinContact': work.next_of_kin_contact ?? '',
            'disability': work.disability ?? '',
            'disabilityDescription': work.disability_description ?? ''
          },
          'studentStudyProgrammes': {
            'name': work.name ?? '',
            'completionYear': work.completion_year ?? '',
            'level': work.level ?? '',
            'duration': work.duration ?? 0, // Assuming duration is numerical
            'modeOfStudy': work.mode_of_study ?? '',
            'specialization': work.specialization ?? ''
          },
          'studentPreliminaryInfos': {
            'institutionName': work.institution_name ?? '',
            'institutionType': work.institution_type ?? '',
            'citizenry': work.citizenry ?? '',
            'studyArea': work.study_area ?? ''
          },
          'declarations': {
            'agreement': work.agreement ?? false, 
            'signature': work.signature ?? ''
          },
    }
    const recordDetails = {
        'preliminary': {
            'type': work.registration_type ?? '',
            'id': work.national_id ?? '',
            'work_status': work.work_status ?? '',
            'practice_category': work.practice_category ?? '',
            'sub_category': work.sub_cateogry ?? '',
        }, 
        'bio': {
            'id': work.national_id ?? '',
            'surname': work.surname ?? '',
            'forenames': work.forenames ?? '',
            'dob': work.dob ?? '',
            'pob': work.pob ?? '',
            'gender': work.gender ?? '',
            'nationality': work.nationality ?? '',
            'postalAddress': work.postal_address ?? '',
            'physicalAddress': work.physical_address ?? '',
            'email': work.email ?? '',
            'mobile': work.mobile ?? '',
            'maritalStatus': work.marital_status ?? '',
            'nextOfKinName': work.next_of_kin_name ?? '',
            'nextOfKinRelation': work.next_of_kin_relation ?? '',
            'nextOfKinContact': work.next_of_kin_contact ?? '',
            'disability': work.disability ?? '',
            'disabilityDescription': work.disability_description ?? ''
          },
          'declarations': {
            'agreement': work.agreement ?? false, 
            'signature': work.signature ?? ''
          },
          'employment': {
            'experienceYears': work.experience_years ?? 0, 
            'currentInstitution': work.current_institution ?? '',
            'institutionType': work.institution_type ?? '',
            'region': work.region ?? '',
            'district': work.district ?? '',
            'cityOrTown': work.city_or_town ?? ''
          },
          'qualifications':{
            'level': work.level ?? '',
            'qualification': work.qualification,
            'institution': work.institution,
            'qualification_year': work.qualification_year,
            'attachments': filepath+work.attachments,
            'minor_subjects': work.minor_subjects.split(", ") ?? [],
            'major_subjects': work.major_subjects.split(", ") ?? [],
          },
          'offenceConvictions': {
            'studentRelatedOffence': work.student_related_offence ?? '',
            'studentRelatedOffenceDetails': work.student_related_offence_details ?? '',
            'drugRelatedOffence': work.drug_related_offence ?? '',
            'drugRelatedOffenceDetails': work.drug_related_offence_details ?? '',
            'licenseFlag': work.license_flag ?? '',
            'licenseFlagDetails': work.license_flag_details ?? '',
            'misconductFlag': work.misconduct_flag ?? '',
            'misconductFlagDetails': work.misconduct_flag_details ?? '',
          },
          'disability':{
            'disability': work.disability ?? '',
            'disability_description': work.disability_description ?? ''
          }
    }
    
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-1">
                {work !== null ? (
                    <>
                        <CaseDetails {...details}/>
                        <WorkArea {...recordDetails}/>
                    </>):(
                    <div className="w-full md:h-96 items-center flex justify-center">
                        <div>
                            <h2 className="text-center text-black text-3xl">Work not found!</h2>
                            <div className="flex items-center justify-center">
                                <Link
                                href='/portal/dashboard/home-o'
                                scroll={false}
                                >
                                    <button
                                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                                    >
                                        Dashboard
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>)
                }
                {/**<Utilities/>*/}
            </div>
       </main>
    );
};

export default Page; 